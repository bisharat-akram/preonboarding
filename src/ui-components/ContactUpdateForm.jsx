/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getContact } from "../graphql/queries";
import { updateContact } from "../graphql/mutations";
const client = generateClient();
export default function ContactUpdateForm(props) {
  const {
    id: idProp,
    contact: contactModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    email: "",
    cell: "",
    profilePicPath: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [email, setEmail] = React.useState(initialValues.email);
  const [cell, setCell] = React.useState(initialValues.cell);
  const [profilePicPath, setProfilePicPath] = React.useState(
    initialValues.profilePicPath
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = contactRecord
      ? { ...initialValues, ...contactRecord }
      : initialValues;
    setName(cleanValues.name);
    setEmail(cleanValues.email);
    setCell(cleanValues.cell);
    setProfilePicPath(cleanValues.profilePicPath);
    setErrors({});
  };
  const [contactRecord, setContactRecord] = React.useState(contactModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getContact.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getContact
        : contactModelProp;
      setContactRecord(record);
    };
    queryData();
  }, [idProp, contactModelProp]);
  React.useEffect(resetStateValues, [contactRecord]);
  const validations = {
    name: [{ type: "Required" }],
    email: [{ type: "Required" }],
    cell: [{ type: "Required" }],
    profilePicPath: [{ type: "Required" }],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          email,
          cell,
          profilePicPath,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateContact.replaceAll("__typename", ""),
            variables: {
              input: {
                id: contactRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ContactUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              email,
              cell,
              profilePicPath,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="Email"
        isRequired={true}
        isReadOnly={false}
        value={email}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              email: value,
              cell,
              profilePicPath,
            };
            const result = onChange(modelFields);
            value = result?.email ?? value;
          }
          if (errors.email?.hasError) {
            runValidationTasks("email", value);
          }
          setEmail(value);
        }}
        onBlur={() => runValidationTasks("email", email)}
        errorMessage={errors.email?.errorMessage}
        hasError={errors.email?.hasError}
        {...getOverrideProps(overrides, "email")}
      ></TextField>
      <TextField
        label="Cell"
        isRequired={true}
        isReadOnly={false}
        value={cell}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              email,
              cell: value,
              profilePicPath,
            };
            const result = onChange(modelFields);
            value = result?.cell ?? value;
          }
          if (errors.cell?.hasError) {
            runValidationTasks("cell", value);
          }
          setCell(value);
        }}
        onBlur={() => runValidationTasks("cell", cell)}
        errorMessage={errors.cell?.errorMessage}
        hasError={errors.cell?.hasError}
        {...getOverrideProps(overrides, "cell")}
      ></TextField>
      <TextField
        label="Profile pic path"
        isRequired={true}
        isReadOnly={false}
        value={profilePicPath}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              email,
              cell,
              profilePicPath: value,
            };
            const result = onChange(modelFields);
            value = result?.profilePicPath ?? value;
          }
          if (errors.profilePicPath?.hasError) {
            runValidationTasks("profilePicPath", value);
          }
          setProfilePicPath(value);
        }}
        onBlur={() => runValidationTasks("profilePicPath", profilePicPath)}
        errorMessage={errors.profilePicPath?.errorMessage}
        hasError={errors.profilePicPath?.hasError}
        {...getOverrideProps(overrides, "profilePicPath")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || contactModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || contactModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
